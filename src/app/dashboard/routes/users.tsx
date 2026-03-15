import { CreateUser } from "@/components/createUser"
import { DeleteUser } from "@/components/deleteUser"

export const Users = () => (
  <div className="h-full w-full flex items-center justify-center">
    <CreateUser/>
    <DeleteUser/>
  </div>
)