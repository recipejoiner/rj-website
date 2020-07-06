import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  SET_OBJECT_REACTION,
  SetReactionVarsType,
  SetReactionResultType,
} from 'requests/reactions'

export const UserReaction = (variables: SetReactionVarsType) => {
  console.log('variables', variables)
  client
    .mutate({
      mutation: SET_OBJECT_REACTION,
      variables: variables,
      context: {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    })
    .then((res) => {
      const { data }: { data?: SetReactionResultType } = res || {}
      if (res.errors) {
        console.error(res.errors)
      } else if (!!data && !!data.result) {
        const { reaction } = data.result || {}
        console.log('data', data)
      } else {
        throw 'Data is Missing'
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
