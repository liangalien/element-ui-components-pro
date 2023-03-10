<script>
    export default {
        functional: true,
        render: (h, ctx) => {
            var VNode;
            if (ctx.props.render instanceof Function)
                VNode = ctx.props.render(h, ctx.props);
            else
                VNode = ctx.props.render;

            return h('div', [VNode], '');
        }
    }
</script>