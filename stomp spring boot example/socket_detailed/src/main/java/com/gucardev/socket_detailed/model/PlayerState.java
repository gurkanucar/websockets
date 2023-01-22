package com.gucardev.socket_detailed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class PlayerState{

  private String clientID;
  private int x;
  private int y;
  private double angle;

  public PlayerState(GameObjectState gameObjectState) {
    this.clientID = gameObjectState.getClientID();
    this.x = gameObjectState.getX();
    this.y = gameObjectState.getY();
    this.angle = gameObjectState.getAngle();
  }
}
