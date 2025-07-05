import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '../contexts/AppContext';
import { Message } from '../types';
import { MessageCircle, Send, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MessagesPage() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = state.currentUser!;
  
  // Get messages for current user
  const userMessages = state.messages.filter(
    msg => msg.toUserId === currentUser.id || msg.fromUserId === currentUser.id
  );

  // Group messages by conversation
  const conversations = userMessages.reduce((acc, message) => {
    const otherUserId = message.fromUserId === currentUser.id ? message.toUserId : message.fromUserId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  // Filter conversations based on search
  const filteredConversations = Object.entries(conversations).filter(([userId, messages]) => {
    const otherUser = state.users.find(u => u.id === userId);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    const otherUserId = selectedMessage.fromUserId === currentUser.id 
      ? selectedMessage.toUserId 
      : selectedMessage.fromUserId;

    const newMessage: Message = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: otherUserId,
      content: replyText,
      timestamp: new Date(),
      read: false
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    setReplyText('');
    
    toast({
      title: 'Message sent',
      description: 'Your reply has been sent successfully.',
    });
  };

  const handleMarkAsRead = (messageId: string) => {
    dispatch({ type: 'MARK_MESSAGE_READ', payload: messageId });
  };

  const getOtherUser = (message: Message) => {
    const otherUserId = message.fromUserId === currentUser.id ? message.toUserId : message.fromUserId;
    return state.users.find(u => u.id === otherUserId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Conversations List */}
        <div className="lg:w-1/3 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <MessageCircle className="h-6 w-6" />
              <span>Messages</span>
            </h1>
            <Badge variant="secondary">
              {userMessages.filter(m => m.toUserId === currentUser.id && !m.read).length} unread
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
            {filteredConversations.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No messages yet</p>
                  <p className="text-sm text-gray-500">Start engaging with customers to see messages here</p>
                </CardContent>
              </Card>
            ) : (
              filteredConversations.map(([userId, messages]) => {
                const otherUser = state.users.find(u => u.id === userId);
                const lastMessage = messages[messages.length - 1];
                const unreadCount = messages.filter(m => m.toUserId === currentUser.id && !m.read).length;
                
                return (
                  <Card 
                    key={userId}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage && getOtherUser(selectedMessage)?.id === userId ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedMessage(lastMessage);
                      // Mark messages as read
                      messages.forEach(msg => {
                        if (msg.toUserId === currentUser.id && !msg.read) {
                          handleMarkAsRead(msg.id);
                        }
                      });
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                          <AvatarFallback>
                            {otherUser?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{otherUser?.name}</p>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{lastMessage.content}</p>
                          <p className="text-xs text-gray-400">
                            {lastMessage.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="lg:w-2/3 flex flex-col">
          {selectedMessage ? (
            <>
              <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getOtherUser(selectedMessage)?.avatar} alt={getOtherUser(selectedMessage)?.name} />
                      <AvatarFallback>
                        {getOtherUser(selectedMessage)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getOtherUser(selectedMessage)?.name}</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 p-0">
                  <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
                    {conversations[getOtherUser(selectedMessage)!.id]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.fromUserId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.fromUserId === currentUser.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.fromUserId === currentUser.id 
                              ? 'text-primary-foreground/70' 
                              : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reply Section */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button 
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to view messages</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}