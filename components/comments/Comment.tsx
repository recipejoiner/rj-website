import React from 'react'
import Moment from 'moment'
import Collapse from '@kunukn/react-collapse'

import { CommentNodeType } from 'requests/comments'
import Subcomments from 'components/comments/Subcomments'
import NewCommentForm from 'components/comments/NewCommentForm'

interface CommentProps {
  commentNode: CommentNodeType
  isNewComment?: boolean
}
const Comment: React.FC<CommentProps> = ({ commentNode, isNewComment }) => {
  const [commentIsOpen, setCommentIsOpen] = React.useState(true)
  const [newCommentFormIsOpen, setNewCommentFormIsOpen] = React.useState(false)

  // for visually reflecting newly added comments
  const [newComments, setNewComments] = React.useState<Array<CommentNodeType>>(
    []
  )
  const addNewComment = (newComment: CommentNodeType) => {
    setNewCommentFormIsOpen(false)
    setNewComments([newComment, ...newComments])
  }

  return (
    <li
      className={`w-full border-l ${
        commentNode.depth == 0 ? 'pb-3 border-b' : ''
      }`}
    >
      <button
        className="p-1 pl-3 text-sm w-full h-full flex items-start"
        onClick={() => {
          setCommentIsOpen(!commentIsOpen)
        }}
      >
        <span className="font-bold text-left">{commentNode.by.username}</span>
        <span className="text-gray-600">
          {' '}
          • {Moment(commentNode.createdAt).fromNow()}
        </span>
      </button>
      <Collapse
        isOpen={commentIsOpen}
        transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <p className="text-sm pl-3">{commentNode.content}</p>
        <div className="text-xs p-1 ml-3 flex flex-row">
          <button className="flex flex-row mr-2">
            <svg
              className="h-5 w-5"
              viewBox="0 0 242 243"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="UI-Icons" transform="translate(-451.000000, -666.000000)">
                <path
                  d="M572,666 C638.826455,666 693,720.397403 693,787.5 C693,854.602597 638.826455,909 572,909 C505.173545,909 451,854.602597 451,787.5 C451,720.397403 505.173545,666 572,666 Z M572,677 C511.248678,677 462,726.472535 462,787.5 C462,848.527465 511.248678,898 572,898 C632.751322,898 682,848.527465 682,787.5 C682,726.472535 632.751322,677 572,677 Z M538.319849,774.133604 C540.408656,774.133604 542.111838,775.829821 542.111838,777.946053 L542.111838,839.187551 C542.111838,841.287629 540.424724,843 538.319849,843 L511.79199,843 C509.703182,843 508,841.303783 508,839.187551 L508,777.929899 C508.016068,775.829821 509.703182,774.133604 511.79199,774.133604 L538.319849,774.133604 Z M587.969203,710 C595.055082,710.129697 597.320635,716.72071 597.320635,716.72071 C597.320635,716.72071 603.378178,728.739616 597.722329,743.44016 C592.950206,755.862928 591.970074,756.864504 591.970074,756.864504 C591.970074,756.864504 590.427569,759.109971 595.312166,759.013045 C595.312166,759.013045 625.133914,758.883809 626.16225,758.883809 C628.363533,758.883809 635.38514,760.903115 634.983446,769.90114 C634.694227,776.556771 630.580882,778.883011 628.476007,779.64227 C628.202855,779.739197 628.058245,780.046131 628.17072,780.320757 C628.218923,780.433838 628.299262,780.530764 628.411736,780.595382 C630.564815,781.855429 634.967379,785.037854 634.870972,789.916496 C634.74243,795.829023 632.380471,798.009873 627.463738,799.366846 C627.190587,799.431464 627.013841,799.722244 627.09418,799.99687 C627.126316,800.14226 627.222722,800.255341 627.335196,800.319958 C629.199056,801.386152 632.396538,803.987017 632.203725,809.253366 C632.010912,814.616642 628.154652,816.506712 626.049776,817.152889 C625.776624,817.233662 625.615947,817.524442 625.696286,817.799067 C625.728421,817.912148 625.80876,818.025229 625.905166,818.089847 C627.23879,819.01065 629.215123,821.094574 629.118717,825.375501 C629.070514,827.637124 628.315329,829.284877 627.367332,830.464151 C625.873031,832.321912 623.527139,833.291179 621.149112,833.307333 L554.982108,833.436569 C554.96604,833.420415 551.382931,833.436569 551.382931,828.60639 L551.382931,784.73092 C551.398999,773.923597 554.403669,763.342436 560.075585,754.166711 C563.530152,748.609583 571.274809,739.708484 575.613102,735.104467 C576.577167,734.070583 580.079937,731.033547 580.079937,729.36964 C580.079937,727.237253 580.320953,723.796356 580.401292,717.383042 C580.449495,713.312122 583.743384,709.968152 587.792458,710 L587.969203,710 Z"
                  id="like-empty"
                ></path>
              </g>
            </svg>
            <span className="ml-1">like</span>
          </button>
          <button
            className="flex flex-row ml-2"
            onClick={() => setNewCommentFormIsOpen(!newCommentFormIsOpen)}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 242 243"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="UI-Icons" transform="translate(-772.000000, -698.000000)">
                <path
                  d="M848.396492,733.265828 L848.396035,698 L772,768.043518 L848.396035,838.087036 L848.396035,806.84117 C939.956836,806.842993 922.537226,862.973471 904.173285,898 C1043.58513,764.318282 928.213408,733.265828 848.396492,733.265828 Z"
                  id="reply"
                ></path>
              </g>
            </svg>
            <span className="ml-1">reply</span>
          </button>
        </div>
        <Collapse
          isOpen={newCommentFormIsOpen}
          transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
        >
          <NewCommentForm
            commentableType="Comment"
            commentableId={commentNode.id}
            addNewComment={addNewComment}
          />
        </Collapse>
        <div className="ml-1 pl-3">
          <ul className="bg-yellow-200">
            {newComments.map((comment) => {
              return <Comment key={comment.id} commentNode={comment} />
            })}
          </ul>
          {!isNewComment && commentNode.id !== '' ? (
            <Subcomments parentId={commentNode.id} />
          ) : null}
        </div>
      </Collapse>
    </li>
  )
}

export default Comment
