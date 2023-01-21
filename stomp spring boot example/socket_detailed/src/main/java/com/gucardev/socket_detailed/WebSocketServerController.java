package com.gucardev.socket_detailed;

import java.security.Principal;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.user.SimpSession;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketServerController {
  // how can i get session in @MessageMapping("/event") method?
  private final SimpMessagingTemplate messagingTemplate;
  private final SimpUserRegistry simpUserRegistry;
  // private final SubscriptionRegistry subscriptionRegistry;

  @EventListener
  public void handleWebSocketConnectListener(SessionConnectedEvent event) {
    // StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
    // String sessionId = headers.getSessionId();
    log.info("Session connected => ID: {}", event.getUser().getName());
  }

  @EventListener
  public void handleWebSocketConnectListener(SessionDisconnectEvent event) {
    log.info("Session disconnected => ID: {}", event.getUser().getName());
    messagingTemplate.convertAndSend("/topic/disconnected", new Event(event.getUser().getName()));
  }

  @MessageMapping("/event")
  public void handleEvent(Event event, SimpMessageHeaderAccessor headers) {
    log.info("/event => ID: {}", headers.getSessionId());
    // messagingTemplate.convertAndSendToUser(sessionId, "/queue/events", event);
  }

  @SubscribeMapping("/game/{room}")
  public void subscribeToRoom(@DestinationVariable String room, SimpMessageHeaderAccessor headers)
      throws Exception {
    log.info("subscribe: /room/{} => ID: {}", room, headers.getSessionId());
    messagingTemplate.convertAndSend("/topic/sendYourPosition/" + room, new Event("your pos"));
  }

  @MessageMapping("/game/{room}")
  public void getMessagePlayerStateFromRoom(
      @DestinationVariable String room,
      SimpMessageHeaderAccessor headers,
      Principal principal,
      @Payload PlayerState event)
      throws Exception {
    log.info(
        "message: /room/{} => ID: {} , message: {}", room, principal.getName(), event.toString());
    // messagingTemplate.convertAndSend("/topic/room/" + room, event);
    String senderSessionId = headers.getSessionId();
    // simpUserRegistry.getUsers();

    Collection<SimpUser> users = simpUserRegistry.getUsers();
    for (SimpUser user : users) {
      for (SimpSession session : user.getSessions()) {
        if (session.getSubscriptions().stream()
            .anyMatch(subscription -> subscription.getDestination().endsWith(room))) {
          log.info("currentUser: {}", user.getName());
          if (!user.getName().equals(principal.getName())) {
            messagingTemplate.convertAndSend("/topic/game/" + room, event);
          }
        }
      }
    }

    //    new ArrayList<>(simpUserRegistry.getUsers()).get(0)//.getSession("bjahtmbr")
  }

  @MessageMapping("/room/{room}")
  public void getMessageFromRoom(
      @DestinationVariable String room,
      SimpMessageHeaderAccessor headers,
      Principal principal,
      @Payload Event event)
      throws Exception {
    log.info(
        "message: /room/{} => ID: {} , message: {}", room, principal.getName(), event.getMessage());
    // messagingTemplate.convertAndSend("/topic/room/" + room, event);
    String senderSessionId = headers.getSessionId();
    // simpUserRegistry.getUsers();

    Collection<SimpUser> users = simpUserRegistry.getUsers();
    for (SimpUser user : users) {
      for (SimpSession session : user.getSessions()) {
        if (session.getSubscriptions().stream()
            .anyMatch(subscription -> subscription.getDestination().endsWith(room))) {
          log.info("currentUser: {}", user.getName());
          if (!user.getName().equals(principal.getName())) {
            messagingTemplate.convertAndSend("/topic/room/" + room, event);
          }
        }
      }
    }

    //    new ArrayList<>(simpUserRegistry.getUsers()).get(0)//.getSession("bjahtmbr")
  }
}
