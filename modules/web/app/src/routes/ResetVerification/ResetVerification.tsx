/*
 * Copyright (c) 2018 Martin Donath <martin.donath@squidfunk.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import {
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core"
import * as React from "react"
import {
  branch,
  compose,
  pure,
  renderComponent,
  withProps
} from "recompose"

import { ResetVerificationRequest } from "common"
import {
  Dialog,
  Form,
  FormButton,
  FormInput,
  FormPassword,
  Header,
  Notification,
  TextLink
} from "components"
import {
  WithForm,
  withForm,
  WithFormProps
} from "enhancers"

import { Styles, styles } from "./ResetVerification.styles"
import { ResetVerificationRedirect } from "./ResetVerificationRedirect"

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

/**
 * Password reset verification render properties
 */
export type ResetVerificationRenderProps =
  & WithStyles<Styles>
  & WithForm<ResetVerificationRequest>

/* ----------------------------------------------------------------------------
 * Presentational component
 * ------------------------------------------------------------------------- */

/**
 * Password reset verification render component
 *
 * @param props - Properties
 *
 * @return JSX element
 */
export const ResetVerificationRender: React.SFC<ResetVerificationRenderProps> =
  ({ classes, form, request, handleChange, handleSubmit }) =>
    <Dialog>
      <Header
        primary={window.env.COGNITO_IDENTITY_POOL_NAME}
        secondary="Unlock your account"
      />
      <Notification />
      <Form onSubmit={handleSubmit}>
        <FormPassword
          name="password" label="New password" required disabled={form.success}
          value={request.password} InputProps={{ readOnly: form.pending }}
          onChange={handleChange} autoComplete="new-password"
        />
        <FormButton
          className={classes.button} disabled={form.pending || form.success}
        >
          Reset password
        </FormButton>
        <Typography className={classes.authenticate}>
          Remembered your password? <TextLink to="/">Sign in</TextLink>
        </Typography>
      </Form>
    </Dialog>

/* ----------------------------------------------------------------------------
 * Enhanced component
 * ------------------------------------------------------------------------- */

/**
 * Password reset verification component
 */
export const ResetVerification =
  compose<ResetVerificationRenderProps, {}>(
    withStyles(styles),
    withProps<WithFormProps<ResetVerificationRequest>, {}>(() => ({
      message: "You have successfully changed your password. Use your " +
               "email address and new password to sign in to your account.",
      initial: {
        password: ""
      }
    })),
    withForm<ResetVerificationRequest>(),
    branch<ResetVerificationRenderProps>(
      ({ form }) => form.success,
      renderComponent(ResetVerificationRedirect)
    ),
    pure
  )(ResetVerificationRender)
