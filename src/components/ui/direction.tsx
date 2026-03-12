import { Direction } from "radix-ui"
import { useTranslation } from "react-i18next"
import { IDirectionProvider } from "@/types"


function DirectionProvider({
  dir = useTranslation().i18n.dir(),
  direction,
  children,
}: Omit<IDirectionProvider, "dir"> & {
  dir?: IDirectionProvider["dir"]
  direction?: IDirectionProvider["dir"]
}) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  )
}

const useDirection = Direction.useDirection

export { DirectionProvider, useDirection }
