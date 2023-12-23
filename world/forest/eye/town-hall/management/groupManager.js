let startRemove = function (e, self) {
    self.hide();
    self.parent.showButton("cancel-remove");

    let $items = metaGroups.browser.$div.find(".object.members");
    $items.find(".read.auth").addClass("invisible");
    $items.addClass("click-me");
    $items.on("click", (element) => {
        remove(element, self.parent);
    });
}

let remove = function (e, buttons) {
    let userID = $(e.currentTarget).find("p.id").text();
    base.do("remove-member", {
        userID,
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id
    }).then((res) => { 
        metaGroups.load();
        switch (res.data) {
            case "auth-error":
                metaGroups.setAlert("You are unauthorized to remove members!")
                break;
            case "login-error":
                metaGroups.setAlert("You are not logged in!")
                break;
            case "self-error":
                metaGroups.setAlert("You cannot remove yourself if you are a Leader!")
                break;
            case "removed":
                metaGroups.setAlert("Removed!")
                break;
        }
    });
}

let removeButton = new Button("remove", startRemove, {
    placeholder: "Remove" 
});

let cancelRemove = function (e, self) {
    self.hide();

    let $items = metaGroups.browser.$div.find(".object.members");
    $items.find(".read.auth").removeClass("invisible");
    $items.removeClass("click-me");
    $items.off();

    self.parent.showButton("remove");
}

let cancelRemoveButton = new Button("cancel-remove", cancelRemove, {
    placeholder: "Cancel Remove", 
    hidden: true 
});


let startDemote = (e, self) => {
    self.hide();
    self.parent.hideButton("promote");
    self.parent.showButton("cancel-demote");

    let $read = self.parent.parent.$div;
    let $items = $read.find(".string.auth");
    $items.addClass("click-me");
    let userID = self.parent.parent.parent.$div.find("p.id").text();
    $items.on("click", (element) => {
        demote(element, userID, self.parent);
    });
}

let demote = (e, userID, buttons) => {
    base.do("save-auth", { 
        title: e.currentTarget.innerText, 
        userID, 
        demote: true, 
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id 
    }).then((res) => { 
        metaGroups.load();
        switch (res.data) {
            case "auth-error":
                metaGroups.setAlert("You are unauthorized to demote members!")
                break;
            case "login-error":
                metaGroups.setAlert("You are not logged in!")
                break;
            case "self-error":
                metaGroups.setAlert("You cannot demote yourself unless there are other Leaders!")
                break;
            case "leader-count-error":
                metaGroups.setAlert("You cannot demote another Leader unless there are other Leaders!")
                break;
            case "demoted":
                metaGroups.setAlert("Demoted!")
                break;
        }
    });
}
    
let demoteButton = new Button("demote", startDemote, {
    placeholder: "Demote" 
});

let cancelDemote = (e, self) => {
    self.hide();
    self.parent.showButton("demote");
    self.parent.showButton("promote");
    
    let $read = self.parent.parent.$div;
    let $items = $read.find(".string.auth");
    $items.removeClass("click-me");
    $items.off();
}

let cancelDemoteButton = new Button("cancel-demote", cancelDemote, {
    placeholder: "Cancel Demote", 
    hidden: true 
});


let startPromote = (e, self) => {
    self.hide();
    self.parent.hideButton("demote");
    self.parent.showButton("cancel-promote");

    let $read = self.parent.parent.$div;
    let $item = $(`<div id="new-promote"></div>`).appendTo($read);
    let $input = $(`<input type="text"></input>`).appendTo($item);
    let $submit = $(`<button>Promote</button>`).appendTo($item);
    let userID = self.parent.parent.parent.$div.find("p.id").text();
    $submit.on("click", (element) => {
        promote(self.parent, $input, userID);
    });
}

let promote = (buttons, $input, userID) => {
    base.do("save-auth", { 
        title: $input.val(), 
        userID, 
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id 
    }).then((res) => { 
        metaGroups.load();
        switch (res.data) {
            case "auth-error":
                metaGroups.setAlert("You are unauthorized to promote members!")
                break;
            case "login-error":
                metaGroups.setAlert("You are not logged in!")
                break;
            case "promoted":
                metaGroups.setAlert("Promoted!")
                break;
            case "redundant":
                metaGroups.setAlert("Promotion already given!")
                break;
        }
    });
}

let promoteButton = new Button("promote", startPromote, {
    placeholder: "Promote"
});

let cancelPromote = (e, self) => {
    self.hide();
    self.parent.showButton("demote");
    self.parent.showButton("promote");
    
    let $read = self.parent.parent.$div;
    
    $read.find("#new-promote").remove();
}

let cancelPromoteButton = new Button("cancel-promote", cancelPromote, {
    placeholder: "Cancel Promote",
    hidden: true
});


let startAccept = (e, self) => {
    self.hide();
    self.parent.hideButton("reject");
    self.parent.showButton("cancel-accept");

    let $items = metaGroups.browser.$div.find(".object.joinRequests");
    $items.addClass("click-me");
    $items.on("click", (element) => {
        accept(element);
    });
}

let accept = (e) => {
    let userID = $(e.currentTarget).find("p.id").text();

    base.do("save-joins", {
        userID,
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id 
    }).then((res) => { 
        metaGroups.load(); 
        switch (res.data) {
            case "auth-error":
                metaGroups.setAlert("You are unauthorized to accept join requests!")
                break;
            case "login-error":
                metaGroups.setAlert("You are not logged in!")
                break;
            case "accepted":
                metaGroups.setAlert("Accepted!")
                break;
            case "redundant":
                metaGroups.setAlert("User already joined!")
                break;
            case "not-found-error":
                metaGroups.setAlert("Join request not found!")
                break;
        }
    });
}

let acceptButton = new Button("accept", startAccept, {
    placeholder: "Accept"
});

let cancelAccept = (e, self) => {
    self.hide();
    self.parent.showButton("reject");
    self.parent.showButton("accept");
    
    let $items = metaGroups.browser.$div.find(".object.joinRequests");
    $items.removeClass("click-me");
    $items.off();
}

let cancelAcceptButton = new Button("cancel-accept", cancelAccept, {
    placeholder: "Cancel Accept",
    hidden: true
});


let startReject = (e, self) => {
    self.hide();
    self.parent.hideButton("accept");
    self.parent.showButton("cancel-reject");

    let $items = metaGroups.browser.$div.find(".object.joinRequests");
    $items.addClass("click-me");
    $items.on("click", (element) => {
        reject(element);
    });
}

let reject = (e) => {
    let userID = $(e.currentTarget).find("p.id").text();

    base.do("save-joins", {
        userID,
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id,
        reject: true
    }).then((res) => { 
        metaGroups.load(); 
        switch (res.data) {
            case "auth-error":
                metaGroups.setAlert("You are unauthorized to reject join requests!")
                break;
            case "login-error":
                metaGroups.setAlert("You are not logged in!")
                break;
            case "rejected":
                metaGroups.setAlert("Rejected!")
                break;
            case "not-found-error":
                metaGroups.setAlert("Join request not found!")
                break;
        }
    });
}

let rejectButton = new Button("reject", startReject, {
    placeholder: "Reject"
});

let cancelReject = (e, self) => {
    self.hide();
    self.parent.showButton("accept");
    self.parent.showButton("reject");
    
    let $items = metaGroups.browser.$div.find(".object.joinRequests");
    $items.removeClass("click-me");
    $items.off();
}

let cancelRejectButton = new Button("cancel-reject", cancelReject, {
    placeholder: "Cancel Reject",
    hidden: true
});


const metaGroups = new MetaBrowser({
    header: "Your Groups"
});
metaGroups.addService("groups", {
    fields: new NBField({
        name: "group",
        label: "Group: ",
        placeholder: "No Groups"
    }, [
        new NBField({
            name: "name",
            placeholder: "No Name",
            type: "string"
        }),
        new NBField({
            name: "id",
            placeholder: null,
            hidden: true,
            type: "string"
        }),
        new NBField({
            name: "description",
            label: "Description: ",
            placeholder: "No Description",
            type: "long-string"
        }),
        new NBField({
            name: "members",
            multiple: true,
            label: "Members: ",
            placeholder: "No Members",
            buttons: [  removeButton, cancelRemoveButton ]
        }, [
            new NBField({
                name: "name",
                label: "Name: ",
                placeholder: "No Name",
                readOnly: true,
                type: "string"
            }),
            new NBField({
                name: "auth",
                label: "Auth: ",
                placeholder: "No Auth",
                multiple: true,
                buttons: [ 
                    demoteButton,
                    cancelDemoteButton,
                    promoteButton,
                    cancelPromoteButton
                ],
                type: "string"
            }),
            new NBField({
                name: "id",
                hidden: true,
                placeholder: null,
                type: "string"
            })
        ]),
        new NBField({
            name: "joinRequests",
            multiple: true,
            label: "Join Requests: ",
            placeholder: "No Join Requests",
            buttons: [ 
                acceptButton,
                cancelAcceptButton,
                rejectButton,
                cancelRejectButton
            ]
        }, [
            new NBField({
                name: "name",
                label: "Name: ",
                placeholder: "No Name",
                readOnly: true,
                type: "string"
            }),
            new NBField({
                name: "note",
                label: "Note: ",
                placeholder: "No Note",
                readOnly: true,
                type: "long-string"
            }),
            new NBField({
                name: "id",
                hidden: true,
                placeholder: null,
                type: "string"
            })
        ]),
        new NBField({
            name: "settings",
            label: "Settings: ",
            placeholder: "No Settings"
        }, [
            new NBField({
                name: "memberLimit",
                label: "Member Limit: ",
                placeholder: 99,
                type: "number"
            })
        ])
    ]),
    label: "Groups",
    multiple: true,
    editable: false,
    toLoad: async () => {
        let data = (await base.do("load-groups")).data;
        return data;
    }
});
metaGroups.render();