"use strict";

module.exports = {
  public: true,
  lockNetwork: true,
  theme: "student",
  userStyles: "student.css",
  host: "0.0.0.0",
  port: 9000,
  reverseProxy: true,
  defaults: {
    name: "Coding Class",
    host: "ircd",
    port: 6667,
    tls: false,
    nick: "",
    username: "siswa",
    realname: "Siswa",
    channels: ["#general"],
  },
};
