package com.gucardev.socket_detailed;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
@Component
public class WebSocketServerHandler {
  /* implements WebSocketHandler {

  @Override
  public void handleMessage(WebSocketSession session, WebSocketMessage<?> message)
      throws Exception {
    log.info("Received message: {}", message.getPayload());
    session.sendMessage(new TextMessage("Echo: " + message.getPayload()));
  }

  @Override
  public void handleTransportError(WebSocketSession session, Throwable exception) {
    log.error("error: {}", exception.getMessage());
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    log.info("New connection: {}", session.getId());
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) {
    log.info("Connection closed: {}, {}", session.getId(), closeStatus);
  }

  @Override
  public boolean supportsPartialMessages() {
    return false;
  }*/
}
