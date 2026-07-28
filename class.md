classDiagram
    class HomePage {
        +Links()
    }

    class MapPage {
        -selectedLand : MapLocation
    }
    
    class DisplayPage {
        -game : GameData
    }

    class ControllerPage {
        -gameState : GameState
    }

    class MapViewer {
        <<Component>>
        +selectedLand : MapLocation
        +onSelect : function
        +ownershipMap : Record ?
        +getFillColor()
        +getStrokeColor()
    }

    class LandmarkDetails {
        <<Component>>
        +land : MapLocation
        +onClose : function
        +flat : boolean
    }

    class SetupView {
        <<Component>>
        +gameState : GameState
        +onStartGame()
    }

    class MuseumControllerView {
        <<Component>>
        +gameState : GameState
        +setMode()
    }

    class GameControllerView {
        <<Component>>
        +gameState : GameState
        +setMode()
    }

    class MuseumMonitorView {
        <<Component>>
        +game : GameData
        +onAction()
    }

    class GameMonitorView {
        <<Component>>
        +game : GameData
    }


    HomePage ..> DisplayPage : <Link to="/display" target="_blank">
    HomePage ..> ControllerPage : <Link to="/controller" target="_blank">
    HomePage ..> MapPage : <Link to="/map">

    MapPage --> LandmarkDetails : Renders
    
    DisplayPage --> MuseumMonitorView : Renders in MUSEUM mode
    DisplayPage --> GameMonitorView : Renders in GAME mode
    MuseumMonitorView --> LandmarkDetails : Renders selected landmark info
    
    SetupView --> MuseumControllerView : Renders in MUSEUM mode
    SetupView --> GameControllerView : Renders in GAME mode
    ControllerPage --> SetupView : Renders in SETUP stage
    
    MuseumControllerView --> MapViewer : Renders console map
    GameControllerView --> MapViewer : Renders console map