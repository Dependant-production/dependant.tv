'use client'
import MuxPlayer from '@mux/mux-player-react'
import styles from './MuxSnippet.module.scss'

interface MuxVideoPlayerProps {
    playbackId: string
    onClick: () => void
}

const MuxSnippet = ({ playbackId, onClick }: MuxVideoPlayerProps) => {
    return (
        <div className={styles.muxContainer} onClick={onClick}>
            <MuxPlayer
                playbackId={playbackId}
                autoPlay
                loop
                muted
                playsInline
                className={styles.mux}
            />
        </div>
    )
}

export default MuxSnippet
