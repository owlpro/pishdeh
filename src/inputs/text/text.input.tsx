import TextField from '@mui/material/TextField';
import React, { Component } from "react";
import { InputImplement } from '../../types/input.implement';
import { TextInputProps, TextInputValueType } from './text.types';

interface IState {
    value: TextInputValueType,
    error: boolean
}

export class TextInput extends Component<TextInputProps, IState> implements InputImplement<TextInputValueType> {
    state: IState = {
        value: this.props.defaultValue || null,
        error: false
    }

    validationTimeout: NodeJS.Timeout | undefined;

    shouldComponentUpdate(nextProps: TextInputProps, nextState: IState) {

        switch (true) {
            case this.state.value !== nextState.value:
            case this.state.error !== nextState.error:
                return true;
            default: return false;
        }
    }

    async setValue(value: TextInputValueType): Promise<any> {
        if (value === this.state.value) return Promise.resolve()

        const setStatePromise = await this.setState({ ...this.state, value })
        if (typeof this.props.onChangeValue === "function") {
            this.props.onChangeValue(value as TextInputValueType)
        }
        return setStatePromise
    }

    getValue(): TextInputValueType {
        return this.state.value || null;
    }

    async clear(): Promise<any> {
        return await this.setValue(this.props.defaultValue || null)
    }

    validation(): boolean {
        if (!this.state.value && this.props.required) {
            clearTimeout(this.validationTimeout)
            this.setState({ ...this.state, error: true })
            this.validationTimeout = setTimeout(() => {
                this.setState({ ...this.state, error: false })
            }, 3000)
            return false;
        }
        return true;
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setValue(event.target.value || null)
    };

    private onClick = (event: React.MouseEvent<HTMLElement>) => {
        clearTimeout(this.validationTimeout)
        this.setState({ ...this.state, error: false })
    }

    render() {
        const { onChangeValue, ...restProps } = this.props;
        return <TextField {...restProps} variant={this.props.variant || "standard"} error={this.state.error} onChange={this.onChange} onClick={this.onClick} value={this.state.value || ''} />
    }
}