import React from "react"
import styled from '../../core/styled';
import { MediaQueries } from "../../utils/createBreakpointStyles"

const StyledProxy = ({
  styles,
  ...props
}: React.PropsWithChildren<{ styles: MediaQueries }>) => <div {...props} />

export default styled(StyledProxy)<{
  styles: MediaQueries
  className?: string
  style?: object
}>(({ styles }) => styles)