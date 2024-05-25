class Projector {
    constructor(id, onSave = null) {
        this.id = id;
        if (!this.id) this.id = "";
        this.$div = $(`.projector#${id}`);
        this.onSave = onSave;

        this.render();
        this.load();
    }

    load = async () => {
        let loaded = await base.loadAll(`${this.id}-projector`, "global");
        if (loaded[0]?.memory?.data?.url) this.$iframe.attr("src", loaded[0].memory.data.url);
    }

    save = async (url = this.$urlInput.val()) => {
        if (this.onSave) {
            this.$iframe.attr("src", url);
            await base.do(this.onSave, {
                id: this.id,
                url: url
            });
        }
    }

    render = () => {
        this.$iframe = $(`<iframe src="" title="Church Stream" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`).appendTo(this.$div);

        if (this.onSave) {
            this.$controls = $(`<div class="controls"></div>`).appendTo(this.$div);
            this.$urlInput = $(`<input type="text"></input>`).appendTo(this.$controls);
            this.$save = $(`<button>Update</button>`).appendTo(this.$controls);
            this.$save.click(() => {this.save();});
        }
    }
}