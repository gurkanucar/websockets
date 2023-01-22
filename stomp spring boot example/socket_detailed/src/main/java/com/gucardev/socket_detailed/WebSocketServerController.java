package com.gucardev.socket_detailed;

import com.gucardev.socket_detailed.model.BulletState;
import com.gucardev.socket_detailed.model.GameObjectState;
import com.gucardev.socket_detailed.model.GameObjectType;
import com.gucardev.socket_detailed.model.PlayerState;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketServerController {

  private final SimpMessagingTemplate messagingTemplate;
  private final SimpUserRegistry simpUserRegistry;

  private final Map<String, List<String>> userSubscriptions = new HashMap<>();

  @EventListener
  public void handleWebSocketConnectListener(SessionConnectEvent event) {
    StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
    Principal user = headers.getUser();
    log.info("Session connected => User: {}", user.getName());
  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
    Principal user = headers.getUser();
    log.info("Session disconnected => User: {}", user.getName());

    // Retrieve the user's subscribed destinations from the map
    List<String> destinations = userSubscriptions.get(user.getName());

    Optional<String> gameRoom =
        destinations.stream().filter(x -> x.startsWith("/topic/game")).findFirst();
    if (gameRoom.isPresent()) {
      String disconnectDestinationRoom =
          gameRoom.get().replaceFirst("/topic/game", "/topic/disconnected");
      log.info("disconnectDestinationRoom => {}", disconnectDestinationRoom);

      messagingTemplate.convertAndSend(disconnectDestinationRoom, new Event(user.getName()));
    }
  }

  // subscribe to room and store room id for disconnect event
  @SubscribeMapping("/game/{room}")
  public void subscribeToGameRoom(
      @DestinationVariable String room, SimpMessageHeaderAccessor headers) throws Exception {
    log.info("subscribe: /room/{} => ID: {}", room, headers.getSessionId());
    List<String> subscriptions =
        userSubscriptions.getOrDefault(headers.getUser().getName(), new ArrayList<>());
    subscriptions.add(headers.getDestination());
    userSubscriptions.put(headers.getUser().getName(), subscriptions);
    messagingTemplate.convertAndSend("/topic/sendYourPosition/" + room, new Event("your pos"));
  }

  // handle messages send it to room except message sender
  // it works like socket.broadcast.emit
  @MessageMapping("/game/{room}")
  public void handleGameUpdates(
      @DestinationVariable String room,
      @Payload GameObjectState gameObjectState,
      Principal principal) {

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
        }
      }
    }
  }
}
