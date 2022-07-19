import React, { HTMLProps } from 'react'

export const Text = (props: HTMLProps<HTMLParagraphElement>) => <p {...props}>{props.children}</p>