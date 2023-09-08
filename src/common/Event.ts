export enum Event {
  // event types: Connection/Disconnection, Command, Trigger
  // notes:
  //    - Connection/Disconnection events can be used both as a command and a trigger
  // event scopes: Server, PlayerClient, ControllerClient
  // Server events, e.g. when a server is started, stopped, etc.

  // General events that can be used by player and controller clients e.g. reserved song list updated
  // command events (triggered by server sent to player and controller clients)
    // can be used when the reserved song list is added, removed, or updated, e.g., order changed
  ReservedSongListUpdated = 'ReservedSongListUpdated', 


  // Player client events, e.g. when a player client is connected, disconnected, finished playing a song, 
  // connection/disconnection
    // when a new player client is connected
  PlayerClientConnected = 'PlayerClientConnected',
    // when a player client is disconnected
  PlayerClientDisconnected = 'PlayerClientDisconnected', 
  // command events (triggered by server sent to player client)
  PlayerClientPlay = 'PlayerClientPlay', // sent by server to player client to play a song
  PlayerClientStop = 'PlayerClientStop', // sent by server to player client when a controller client calls stop
    // sent by server to player client when a controller client calls pause
  PlayerClientPause = 'PlayerClientPause', 
    // sent by server to player client when a controller client calls resume
  PlayerClientResume = 'PlayerClientResume', 
  // trigger events (listened by server from player client)
    // when a player client finished playing a song
  PlayerClientFinishedPlaying = 'PlayerClientFinishedPlaying',

  // Controller client events, e.g. when a controller client is connected, disconnected, paused a song, etc.
  // connection/disconnection
    // when a new controller client is connected
  ControllerClientConnected = 'ControllerClientConnected',
    // when a controller client is disconnected
  ControllerClientDisconnected = 'ControllerClientDisconnected', 
  // trigger events (listened by server from controller client)
  // sent by controller client to server when a song is reserved
  ControllerReserveSong = 'ControllerReserveSong', 
  ControllerCancelReservedSong = 'ControllerCancelReservedSong', // sent by controller client to server when a song is cancelled
  // sent to server for the player client to pause the song
  ControllerSongPaused = 'ControllerSongPaused',
  // sent to server for the player client to resume the song
  ControllerSongResumed = 'ControllerSongResumed', 
  // when controller client calls stop, the player client should stop the song and move to the next song, if any
  ControllerSongStopped = 'ControllerSongStopped',
}