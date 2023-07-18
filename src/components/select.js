import {Select} from 'element-ui';

export default {
    extends: Select,
    methods: {
        setSelected() {
            if (!this.multiple) {
                let option = this.getOption(this.value);
                if (option.created) {
                    this.createdLabel = option.currentLabel;
                    this.createdSelected = true;
                } else {
                    this.createdSelected = false;
                }


                if (option.value && option.value instanceof Object) {

                    this.selected = option.value;
                    this.selectedLabel = option.value.label;
                    option.value.currentLabel = option.value.label;
                } else {
                    this.selectedLabel = option.currentLabel;
                    this.selected = option;
                }

                if (this.filterable) this.query = this.selectedLabel;
                return;
            }
            let result = [];

            if (Array.isArray(this.value)) {
                this.value.forEach(value => {
                    if (value instanceof Object) {
                        value.currentLabel = value.label;
                    } else {
                        value = this.getOption(value);
                    }

                    result.push(value);
                });
            }
            this.selected = result;
            this.$nextTick(() => {
                this.resetInputHeight();
            });
        },

        handleOptionSelect(option, byClick) {
            if (this.multiple) {
                const value = (this.value || []).slice();
                const optionIndex = this.getValueIndex(value, option.value);

                if (optionIndex > -1) {
                    value.splice(optionIndex, 1);
                } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
                    value.push(option.value);
                }

                this.$emit('input', value);
                this.emitChange(value);
                if (option.created) {
                    this.query = '';
                    this.handleQueryChange('');
                    this.inputLength = 20;
                }
                if (this.filterable) this.$refs.input.focus();
            } else {
                this.$emit('input', option.value);
                this.emitChange(option.value);
                this.visible = false;
            }
            this.isSilentBlur = byClick;
            this.setSoftFocus();
            if (this.visible) return;
            this.$nextTick(() => {
                this.scrollToOption(option);
            });
        },
    }

};