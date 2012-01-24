

/**
 * Contains functions used to include common bits of text.
 */
var includeLib = {
    
    /**
     * Prints out the table of contents.
     */
    tableOfContents: function() {
        document.writeln('<div id="navigation">\
            <ul>\
                <li>\
                    <div id="nav-summary" onmouseover="toggleNavSummary(false)" onmouseout="toggleNavSummary(true)">\
                        <a href="index.html" class="button">Table of contents</a>\
                        <div id="nav-summary-childs" style="display:none;">\
                            <div class="toc-item" style="margin-left:0"><a href="introduction.html"><strong>1</strong><span>Introduction</span></a></div>\
                            <div class="toc-item" style="margin-left:0"><a href="getting_started.html"><strong>2</strong><span>Getting Started</span></a></div>\
                        </div>\
                    </div>\
                </li>\
                <li class="separator selected">\
                    <a id="ref-button" onclick="localToggle(); return false;" href="#">Quick Reference</a>\
                </li>\
            </ul>\
        </div>')
    },
    
    /**
     * Prints out the header.
     */
    header: function() {
        document.writeln('\
            <div id="header">\
                <div class="images clearfix">\
                    <span id="logo"><a href="#" target="_blank"><img alt="LightTouch DB Logo" title="LightTouch DB" src="./img/logo.png" border="0"/></a></span>\
                    <span id="sponsor"><a href="http://www.onepointltd.com/" target="_blank"><img alt="Onepoint Logo" title="One Point Consulting LTD - Enabling Open and Collaborative Enterprises"\
                        src="http://www.onepointltd.com/images/logo_small.gif" border="0"/></a></span>\
                </div>\
                <p>DB Creation Made Easy</p>\
            </div>\
        ')
    },
    
    /**
     * Prints out the project information.
     */
    projectInfo: function() {
        document.writeln('<div class="project">\
                <h1>LightTouch DB - Reference Documentation</h1>\
                <p><strong>Authors:</strong> Alexander Polev, Gil Fernandes</p>\
                <p><strong>Version:</strong> 0.1</p>\
            </div>\
        ')
    },
    
    /**
     * Prints out the table of contents.
     */
    introTableOfContents: function() {
        document.writeln('<div class="toc-item tocLevel0"><a href="introduction.html#introduction"><strong>1</strong><span>Introduction</span></a></div>\
                <div class="toc-item tocLevel1"><a href="introduction.html#whatis"><strong>1.1</strong><span>What is LightTouch DB?</span></a></div>\
                <div class="toc-item tocLevel2"><a href="introduction.html#designer"><strong>1.1.1</strong><span>Designer</span></a></div>\
                <div class="toc-item tocLevel2"><a href="introduction.html#workbench"><strong>1.1.2</strong><span>Workbench</span></a></div>\
                <div class="toc-item tocLevel2"><a href="introduction.html#roles"><strong>1.1.3</strong><span>User Roles</span></a></div>\
                <div class="toc-item tocLevel2"><a href="introduction.html#persistence"><strong>1.1.4</strong><span>Persistence</span></a></div>\
                <div class="toc-item tocLevel2"><a href="introduction.html#communication"><strong>1.1.5</strong><span>Server Client Communication</span></a></div>\
                <div class="toc-item tocLevel2"><a href="introduction.html#webframeworks"><strong>1.1.6</strong><span>Web Frameworks</span></a></div>\
                <div style="clear:both" ></div>\
        ');
    },
    
    /**
     * Prints out the table of contents.
     */
    gettingStarted: function() {
        document.writeln('<div class="toc-item tocLevel0"><a href="getting_started.html"><strong>2</strong><span>Getting Started</span></a></div>\
                <div class="toc-item tocLevel1"><a href="getting_started.html#requirements"><strong>2.1</strong><span>Installation Requirements</span></a></div>\
                <div class="toc-item tocLevel2"><a href="getting_started.html#downloadingAndInstalling"><strong>2.2</strong><span>Downloading and Installing</span></a></div>\
                <div class="toc-item tocLevel2"><a href="getting_started.html#creatingAnApplication"><strong>2.3</strong><span>Creating an Application</span></a></div>\
                <div class="toc-item tocLevel2"><a href="getting_started.html#runningAnApplication"><strong>2.4</strong><span>Running an Application</span></a></div>\
        ');
    },
    
    /**
     * Prints the line at the footer.
     */
    footer: function() {
        document.writeln('<div id="footer">\
            Copies of this document may be made for your own use and for distribution to others, provided that you do not charge any fee for such copies and further provided that each copy contains \
            this Copyright Notice, whether distributed in print or electronically.\
            Sponsored by <a href="http://www.onepointltd.com">Onepoint Consulting Ltd</a>\
            </div>')
    }
}