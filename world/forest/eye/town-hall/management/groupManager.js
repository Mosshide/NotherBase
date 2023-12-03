let startRemove = function (e) {
    let $lis = metaGroups.browser.$div.find(".read.members>ul>li");
    this.hide();
    this.settings.parent.show("cancel-remove");
    $(`.read.members>ul>li .read.auth`).addClass("invisible");
    
    for (let i = 0; i < $lis.length; i++) {
        let $li = $($lis[i]);
        $li.addClass("click-me");
        $li.on("click", (element) => {
            remove(element);
        });
    }
}

let remove = function (e) {
    let $li = $(e.currentTarget);
    let userID = $li.find(".read.id").text();

    base.do("remove-member", {
        userID,
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id
    }).then((res) => { 
        metaGroups.reload(); 
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
    label: "Remove" 
});

let cancelRemove = function (e) {
    let $lis = metaGroups.browser.$div.find(".read.members>ul>li");
    this.hide();
    this.settings.parent.show("remove");
    $(`.read.members>ul>li .read.auth`).removeClass("invisible");
    
    for (let i = 0; i < $lis.length; i++) {
        let $li = $($lis[i]);
        $li.removeClass("click-me");
        $li.off();
    }
}

let cancelRemoveButton = new Button("cancel-remove", cancelRemove, {
    label: "Cancel Remove", 
    hidden: true 
});

let startDemote = (e, self) => {
    self.hide();

    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.hide("promote");

    self.settings.parent.show("cancel-demote");

    let $lis = $ul.find("li");
    $lis.addClass("click-me");
    $lis.on("click", (element) => {
        demote(element);
    });
}

let demote = (e) => {
    let $li = $(e.currentTarget);
    let userID = $li.parent().parent().parent().find("p.id").text();

    base.do("save-auth", { 
        title: $li.find("p").text(), 
        userID, 
        demote: true, 
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id 
    }).then((res) => { 
        metaGroups.reload(); 
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
    label: "Demote" 
});

let cancelDemote = (e, self) => {
    self.hide();
    
    let $ul = self.$div.parent().find("ul.content");

    self.settings.parent.show("demote");
    self.settings.parent.show("promote");
    
    let $lis = $ul.find("li");
    $lis.removeClass("click-me");
    $lis.off();
}

let cancelDemoteButton = new Button("cancel-demote", cancelDemote, {
    label: "Cancel Demote", 
    hidden: true 
});


let startPromote = (e, self) => {
    self.hide();

    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.hide("demote");
    self.settings.parent.show("cancel-promote");

    let $li = $(`<li id="new-promote"></li>`).appendTo($ul);
    let $input = $(`<input type="text"></input>`).appendTo($li);
    let $submit = $(`<button>Promote</button>`).appendTo($li);
    let userID = $ul.parent().parent().find("p.id").text();
    $submit.on("click", (element) => {
        promote(element, $input, userID);
    });
}

let promote = (e, $input, userID) => {
    base.do("save-auth", { 
        title: $input.val(), 
        userID, 
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id 
    }).then((res) => { 
        metaGroups.reload(); 
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
    label: "Promote"
});

let cancelPromote = (e, self) => {
    self.hide();
    
    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.show("demote");
    self.settings.parent.show("promote");
    
    $ul.find("#new-promote").remove();
}

let cancelPromoteButton = new Button("cancel-promote", cancelPromote, {
    label: "Cancel Promote",
    hidden: true
});

let startAccept = (e, self) => {
    self.hide();

    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.hide("reject");
    self.settings.parent.show("cancel-accept");

    let $lis = $ul.find("li");
    $lis.addClass("click-me");
    $lis.on("click", (element) => {
        accept(element);
    });
}

let accept = (e) => {
    let $li = $(e.currentTarget);
    let userID = $li.find(".read.id").text();

    base.do("save-joins", {
        userID,
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id 
    }).then((res) => { 
        metaGroups.reload(); 
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
    label: "Accept"
});

let cancelAccept = (e, self) => {
    self.hide();
    
    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.show("reject");
    self.settings.parent.show("accept");
    
    let $lis = $ul.find("li");
    $lis.removeClass("click-me");
    $lis.off();
}

let cancelAcceptButton = new Button("cancel-accept", cancelAccept, {
    label: "Cancel Accept",
    hidden: true
});

let startReject = (e, self) => {
    self.hide();

    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.hide("accept");
    self.settings.parent.show("cancel-reject");

    let $lis = $ul.find("li");
    $lis.addClass("click-me");
    $lis.on("click", (element) => {
        reject(element);
    });
}

let reject = (e) => {
    let $li = $(e.currentTarget);
    let userID = $li.find("p.id").text();

    base.do("save-joins", {
        userID,
        groupID: metaGroups.serving.data[metaGroups.serving.selected].id,
        reject: true
    }).then((res) => { 
        metaGroups.reload(); 
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
    label: "Reject"
});

let cancelReject = (e, self) => {
    self.hide();
    
    let $ul = self.$div.parent().parent().find("ul.content");

    self.settings.parent.show("accept");
    self.settings.parent.show("reject");
    
    let $lis = $ul.find("li");
    $lis.removeClass("click-me");
    $lis.off();
}

let cancelRejectButton = new Button("cancel-reject", cancelReject, {
    label: "Cancel Reject",
    hidden: true
});


const metaGroups = new MetaBrowser({
    label: "Your Groups"
});
metaGroups.addService("groups", {
    fields: new NBField({
        name: "group",
        multiple: true,
        label: "Group: ",
        placeholder: "No Groups"
    }, [
        new NBField({
            name: "name",
            placeholder: "No Name"
        }, "string"),
        new NBField({
            name: "id",
            placeholder: null,
            hidden: true
        }, "string"),
        new NBField({
            name: "description",
            label: "Description: ",
            placeholder: "No Description"
        }, "long-string"),
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
                readOnly: true
            }, "string"),
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
                ]
            }, "string"),
            new NBField({
                name: "id",
                hidden: true,
                placeholder: null
            }, "string")
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
                readOnly: true
            }, "string"),
            new NBField({
                name: "note",
                label: "Note: ",
                placeholder: "No Note",
                readOnly: true
            }, "long-string"),
            new NBField({
                name: "id",
                hidden: true,
                placeholder: null
            }, "string")
        ]),
        new NBField({
            name: "settings",
            label: "Settings: ",
            placeholder: "No Settings"
        }, [
            new NBField({
                name: "memberLimit",
                label: "Member Limit: ",
                placeholder: 99
            }, "number")
        ])
    ]),
    label: "Groups",
    multiple: true,
    toLoad: async () => {
        let data = (await base.do("load-groups")).data;
        return data;
    }
});