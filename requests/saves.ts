import gql from 'graphql-tag'

export interface SetSavedResultType {
  result: {
    saved: boolean
  }
}
export interface SetSavedVarsType {
  saveableType: 'Recipe'
  saveableId: string
  savedState: boolean
}
export const SET_OBJECT_SAVED = gql`
  mutation setObjectSaved(
    $saveableType: String!
    $saveableId: ID!
    $savedState: Boolean!
  ) {
    result: setObjectSaved(
      saveableType: $saveableType
      saveableId: $saveableId
      savedState: $savedState
    ) {
      saved
    }
  }
`
