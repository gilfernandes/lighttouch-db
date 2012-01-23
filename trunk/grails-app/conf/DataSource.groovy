dataSource {
    pooled = true
    driverClassName = "org.postgresql.Driver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = true
    cache.provider_class = 'net.sf.ehcache.hibernate.EhCacheProvider'
}

String strategy = "update" // one of 'create', 'create-drop','update'
String dataSourceUrl = "jdbc:postgresql://localhost:5432/crm"
String dataSourceUsername = "crm"
String dataSourcePassword = "crm4all"

// environment specific settings
environments {
    development {
        dataSource {
            dbCreate = strategy 
            url = dataSourceUrl
            username = dataSourceUsername
            password = dataSourcePassword
        }
    }
    test {
        dataSource {
            dbCreate = strategy 
            url = dataSourceUrl
            username = dataSourceUsername
            password = dataSourcePassword
        }
    }
    production {
        dataSource {
            dbCreate = strategy 
            url = dataSourceUrl
            username = dataSourceUsername
            password = dataSourcePassword
        }
    }
}
