package com.gucardev.socket_detailed.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

  @GetMapping("/")
  public String index() {
    return "forward:/index.html";
  }
}
