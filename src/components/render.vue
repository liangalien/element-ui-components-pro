<script>
    export default {
        functional: true,
        props: {
            value: {
                required: true
            },
            row: {
                type: Object,
                required: true
            },
            render: {
                type: Function,
                required: true
            },
            scope: {
                type: Object,
                required: true
            }
        },
        render: (h, ctx) => {
            const arr = [];
            const params = {
                value: ctx.props.value,
                row: ctx.props.row,
                index: ctx.props.scope.$index,
                scope: ctx.props.scope
            };
            const VNode = ctx.props.render(h, params);
            arr.push(VNode);
            return h('div', arr, '');
        }
    };
</script>