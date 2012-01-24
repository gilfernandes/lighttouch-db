package com.consultinglimited.crm

/**
 * Simple keepalive controller.
 */
class KeepaliveController {

    /**
     * Renders directly to the browser.
     */
    def index() {
        render(text:"{\"status\": \"OK\"}", contentType:"text/plain", encoding:"UTF-8")
    }
}
