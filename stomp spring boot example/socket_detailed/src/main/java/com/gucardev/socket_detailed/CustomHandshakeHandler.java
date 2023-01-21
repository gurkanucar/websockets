package com.gucardev.socket_detailed;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

class CustomHandshakeHandler extends DefaultHandshakeHandler {
  // Custom class for storing principal
  @Override
  protected Principal determineUser(
      ServerHttpRequest request,
      WebSocketHandler wsHandler,
      Map<String, Object> attributes
  ) {
    // Generate principal with UUID as name
    return new StompPrincipal(UUID.randomUUID().toString());
  }
}