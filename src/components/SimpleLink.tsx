import type { ReactNode } from "react"
import { Link, type LinkProps } from "react-router"

interface SimpleLinkProps extends LinkProps {
  children: ReactNode
}

export default function SimpleLink(props: SimpleLinkProps) {

  const { children, to } = props

  return (
    <Link className="text-blue-600 hover:text-blue-500 active:text-blue-600 px-2" to={to}>
      {children}
    </Link>
  )
}