package com.gucardev.socket_detailed.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public  class GameObjectState {

  private GameObjectType type;
  private String clientID;
  private int x;
  private int y;
  private double angle;
}
