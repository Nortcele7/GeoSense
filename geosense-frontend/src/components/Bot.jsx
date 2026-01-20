import { Container, Header, MessageList, Composer, useWebchat, Fab } from '@botpress/webchat'
import { useState, useMemo } from 'react'

const headerConfig = {
  botName: 'Geosense Bot',
  botAvatar: 'https://cdn.botpress.cloud/bot-avatar.png',
  botDescription: 'Your personal soil assistant.',

  phone: {
    title: 'Call Support',
    link: '+977 9812345678',
  },

  email: {
    title: 'Email Us',
    link: 'chatbot.support@geosense.com',
  },

  website: {
    title: 'Visit our website',
    link: 'https://geosense.vercel.app',
  }
}

function App() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(true)
  const { client, messages, isTyping, user, clientState, newConversation } = useWebchat({
    clientId: '9c464474-2746-4c93-a843-29d2da216399', // Insert your Client ID here
  })

  const config = {
    botName: 'GeoSense Bot',
    botAvatar: 'https://picsum.photos/id/80/400',
    botDescription: 'Your virtual assistant for all things support.',
  }
  const enrichedMessages = useMemo(
  () =>
    messages.map((message) => {
      const { authorId } = message
      const direction = authorId === user?.userId ? 'outgoing' : 'incoming'
      return {
        ...message,
        direction,
        sender:
          direction === 'outgoing'
            ? { name: user?.name ?? 'You', avatar: user?.pictureUrl }
            : { name: config.botName ?? 'Bot', avatar: config.botAvatar },
      }
    }),
  [config.botAvatar, config.botName, messages, user?.userId, user?.name, user?.pictureUrl]
  )

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }

  return (
    <>
    <Container
      style={{
        width: '500px',
        height: '800px',
        display: isWebchatOpen ? 'flex' : 'none',
        position: 'fixed',
        bottom: '90px',
        right: '20px',
      }}
    >
      <Header
        // onOpenChange={() => console.log('Override the header open change')}
        defaultOpen={false}
        closeWindow={() => setIsWebchatOpen(false)}
        restartConversation={newConversation}
        disabled={false}
        configuration={headerConfig}
      />
      <MessageList
        // botAvatar={config.botAvatar}
        botName={config.botName}
        botDescription={config.botDescription}
        isTyping={isTyping}
        headerMessage="Chat History"
        showMarquee={true}
        messages={enrichedMessages}
        sendMessage={client?.sendMessage}
      />
      <Composer
        disableComposer={false}
        isReadOnly={false}
        allowFileUpload={true}
        sendMessage={client?.sendMessage}
        uploadFile={client?.uploadFile}
        composerPlaceholder="Type a message..."
      />
    </Container>
    <Fab onClick={() => toggleWebchat()} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '64px', height: '64px' }}/>
    </>
  )
}

export default App