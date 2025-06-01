'use client'

import { useState } from 'react'
import { XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BadgeClosableProps {
    text: string;
    roleName: string;
    onClickEvent: (roleName : string) => void;
}


const BadgeClosable = ({text, roleName, onClickEvent}: BadgeClosableProps) => {
    const [isActive, setIsActive] = useState(true)
    const handleClick = () => {
        setIsActive(false)
        onClickEvent(roleName)
    }
    if (!isActive) return null
    return (
        <Badge className='mx-2 my-1.5 p-1.5 font-bold'>
            {text}
            <button
                className='focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
                aria-label='Close'
                onClick={handleClick}
            >
                <XIcon className='size-3' aria-hidden='true' />
            </button>
        </Badge>
    )
}
export default BadgeClosable
