class RemoveButton extends Button {
    constructor() {
        super("remove", {
            label: "Remove"
        });

        this.enable(this.startRemove);
    }

    startRemove = (e) => {
        let $lis = metaGroups.browser.$div.find(".read.members>ul>li");
        this.hide();
        this.settings.parent.show("cancel-remove");
        $(`.read.members>ul>li .read.auth`).addClass("invisible");
        
        for (let i = 0; i < $lis.length; i++) {
            let $li = $($lis[i]);
            $li.addClass("click-me");
            $li.on("click", (element) => {
                this.remove(element);
            });
        }
    }    

    remove = (e) => {
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
}

class CancelRemoveButton extends Button {
    constructor () {
        super("cancel-remove", {
            label: "Cancel Remove",
            hidden: true
        });

        this.enable(this.cancelRemove);
    }

    cancelRemove = (e) => {
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
}

class DemoteButton extends Button {
    constructor() {
        super("demote", {
            label: "Demote"
        });

        this.enable(this.startDemote);
    }

    startDemote = (e) => {
        this.hide();
    
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.hide("promote");

        this.settings.parent.show("cancel-demote");
    
        let $lis = $ul.find("li");
        $lis.addClass("click-me");
        $lis.on("click", (element) => {
            this.demote(element);
        });
    }
    
    demote = (e) => {
        let $li = $(e.currentTarget);
        let $ul = this.$div.parent().parent().parent();
        let userID = $ul.find(".read.id").text();
    
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
    
}

class CancelDemoteButton extends Button {
    constructor () {
        super("cancel-demote", {
            label: "Cancel Demote",
            hidden: true
        });

        this.enable(this.cancelDemote);
    }

    cancelDemote = (e) => {
        this.hide();
        
        let $ul = this.$div.parent().find("ul.content");
    
        this.settings.parent.show("demote");
        this.settings.parent.show("promote");
        
        let $lis = $ul.find("li");
        $lis.removeClass("click-me");
        $lis.off();
    }
}

class PromoteButton extends Button {
    constructor() {
        super("promote", {
            label: "Promote"
        });

        this.enable(this.startPromote);
    }

    startPromote = (e) => {
        this.hide();
    
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.hide("demote");
        this.settings.parent.show("cancel-promote");
    
        let $li = $(`<li id="new-promote"></li>`).appendTo($ul);
        let $input = $(`<input type="text"></input>`).appendTo($li);
        let $submit = $(`<button>Promote</button>`).appendTo($li);
        $submit.on("click", (element) => {
            this.promote(element, $input);
        });
    }
    
    promote = (e, $input) => {
        let $ul = this.$div.parent().parent().parent();
        let userID = $ul.find(".read.id").text();
    
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
}

class CancelPromoteButton extends Button {
    constructor () {
        super("cancel-promote", {
            label: "Cancel Promote",
            hidden: true
        });

        this.enable(this.cancelPromote);
    }

    cancelPromote = (e) => {
        this.hide();
        
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.show("demote");
        this.settings.parent.show("promote");
        
        $ul.find("#new-promote").remove();
    }
}

class AcceptButton extends Button {
    constructor() {
        super("accept", {
            label: "Accept"
        });

        this.enable(this.startAccept);
    }

    startAccept = (e) => {
        this.hide();
    
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.hide("reject");
        this.settings.parent.show("cancel-accept");
    
        let $lis = $ul.find("li");
        $lis.addClass("click-me");
        $lis.on("click", (element) => {
            this.accept(element);
        });
    }
    
    accept = (e) => {
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
}

class CancelAcceptButton extends Button {
    constructor () {
        super("cancel-accept", {
            label: "Cancel Accept",
            hidden: true
        });

        this.enable(this.cancelAccept);
    }

    cancelAccept = (e) => {
        this.hide();
        
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.show("reject");
        this.settings.parent.show("accept");
        
        let $lis = $ul.find("li");
        $lis.removeClass("click-me");
        $lis.off();
    }
}

class RejectButton extends Button {
    constructor() {
        super("reject", {
            label: "Reject"
        });

        this.enable(this.startReject);
    }

    startReject = (e) => {
        this.hide();
    
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.hide("accept");
        this.settings.parent.show("cancel-reject");
    
        let $lis = $ul.find("li");
        $lis.addClass("click-me");
        $lis.on("click", (element) => {
            this.reject(element);
        });
    }
    
    reject = (e) => {
        let $li = $(e.currentTarget);
        let userID = $li.find(".read.id").text();
    
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
}

class CancelRejectButton extends Button {
    constructor () {
        super("cancel-reject", {
            label: "Cancel Reject",
            hidden: true
        });

        this.enable(this.cancelReject);
    }

    cancelReject = (e) => {
        this.hide();
        
        let $ul = this.$div.parent().parent().find("ul.content");
    
        this.settings.parent.show("accept");
        this.settings.parent.show("reject");
        
        let $lis = $ul.find("li");
        $lis.removeClass("click-me");
        $lis.off();
    }
}

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
            buttons: [ RemoveButton, CancelRemoveButton ]
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
                buttons: [ DemoteButton, CancelDemoteButton, PromoteButton, CancelPromoteButton ]
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
            buttons: [ AcceptButton, CancelAcceptButton, RejectButton, CancelRejectButton ]
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