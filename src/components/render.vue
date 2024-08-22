<script>
    export default {
        functional: true,
        render: (h, ctx) => {
            let VNode;
            if (ctx.props.render) {
                if (ctx.props.render instanceof Function)
                    VNode = ctx.props.render(h, ctx.props);
                else
                    VNode = ctx.props.render;
            } else {
                VNode = ctx.props.value;
            }
            return h('span', [VNode], '');
        }
    }
</script>
