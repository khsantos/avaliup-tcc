import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/src/components/ui/hover-card"

type Props = {
    title: string;
    text: string;
}

export const HoverCardTerms = ({ title, text }: Props) => {
    return (
        <HoverCard>
            <HoverCardTrigger className="cursor-pointer hover:underline text-[#0969da] dark:text-[#00AFD3]">{title}</HoverCardTrigger>
            <HoverCardContent className="font-light">
                {text}
            </HoverCardContent>
        </HoverCard>
    )
} 