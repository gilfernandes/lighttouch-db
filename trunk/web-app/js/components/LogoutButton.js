
/**
 * The logout button.
 */
isc.ToolStripButton.create({
    ID: "logoutButton",
    baseStyle: "logoutButtonStyle",
    icon: CONSTANTS.get('IMAGES') + "/logout.png",
    click: "location.href='logout'",
    title: "Logout"
});