class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?"{ constraints { // apply constraints here
            } }

        "/"(view:"/index")
        "500"(view:'/error')
        "/designer.gsp"(view:'/designer')
        "/workbench.gsp"(view:'/workbench')
        "/login/$action?"(controller: "login")
        "/logout/$action?"(controller: "logout")
    }
}
