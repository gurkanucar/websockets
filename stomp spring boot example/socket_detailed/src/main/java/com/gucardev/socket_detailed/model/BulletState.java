package com.gucardev.socket_detailed.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
public class BulletState {

  private String clientID;
  private int x;
  private int y;
  private double angle;

  public BulletState(GameObjectState gameObjectState) {
    this.clientID = gameObjectState.getClientID();
    this.x = gameObjectState.getX();
    this.y = gameObjectState.getY();
    this.angle = gameObjectState.getAngle();
  }
}
