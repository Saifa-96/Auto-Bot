import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../lib';

const meta = {
    title: 'Example/Input',
    component: Input,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof Input>

export default meta;
type Story = StoryObj<typeof meta>

export const Basic: Story = {
    args: {
        placeholder: 'Placeholder'
    }
}