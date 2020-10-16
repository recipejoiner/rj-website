import * as React from 'react'

type StatViewProps = {
  name: string
  count: number
  onClick: () => void
}

const StatView: React.FC<StatViewProps> = ({ name, count, onClick }) => {
  const [currentCount, setCurrentCount] = React.useState(count)
  return (
    <li className="text-center w-1/3" key={name}>
      <button onClick={onClick}>
        <span className="block text-gray-900 font-bold">{currentCount}</span>
        {name}
      </button>
    </li>
  )
}

export default StatView
