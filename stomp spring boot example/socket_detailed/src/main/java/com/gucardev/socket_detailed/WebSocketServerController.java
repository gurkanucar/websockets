package com.gucardev.socket_detailed;

import com.gucardev.socket_detailed.model.BulletState;
import com.gucardev.socket_detailed.model.GameObjectState;
import com.gucardev.socket_detailed.model.GameObjectType;
import com.gucardev.socket_detailed.model.PlayerState;
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

  @SubscribeMapping("/game/{room}")
  public void subscribeToRoom(@DestinationVariable String room, SimpMessageHeaderAccessor headers)
      throws Exception {
    log.info("subscribe: /room/{} => ID: {}", room, headers.getSessionId());
    messagingTemplate.convertAndSend("/topic/sendYourPosition/" + room, new Event("your pos"));
  }

  @MessageMapping("/game/{room}")
  public void handleMessage(
      @DestinationVariable String room,
      @Payload GameObjectState gameObjectState,
      Principal principal) {

    // messagingTemplate.convertAndSend("/topic/game/" + room, playerState);

    // Get all the users in the application
    Collection<SimpUser> users = simpUserRegistry.getUsers();

    for (SimpUser user : users) {
      for (SimpSession session : user.getSessions()) {
        if (session.getSubscriptions().stream()
            .anyMatch(subscription -> subscription.getDestination().endsWith(room))) {
          // If the user is subscribed to the room, add their userId to the list
          if (!user.getName().equals(principal.getName())) {
            if (gameObjectState.getType().equals(GameObjectType.PLAYER)) {
              messagingTemplate.convertAndSendToUser(
                  user.getName(), "/queue/player", new PlayerState(gameObjectState));
            } else {
              messagingTemplate.convertAndSendToUser(
                  user.getName(), "/queue/bullet", new BulletState(gameObjectState));
            }
          }
          // usersInRoom.add(user.getName());
        }
      }
    }
  }
}
