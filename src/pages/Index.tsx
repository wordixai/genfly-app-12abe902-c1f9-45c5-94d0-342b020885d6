import { useState, useRef, useEffect } from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal, Clock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type Story = {
  id: string;
  username: string;
  avatar: string;
  seen: boolean;
};

type Post = {
  id: string;
  username: string;
  avatar: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timeAgo: string;
  liked: boolean;
};

const Index = () => {
  const [stories, setStories] = useState<Story[]>([
    { id: '1', username: 'user1', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', seen: false },
    { id: '2', username: 'user2', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', seen: false },
    { id: '3', username: 'user3', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', seen: true },
    { id: '4', username: 'user4', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', seen: false },
    { id: '5', username: 'user5', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', seen: false },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      username: 'user1',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      content: 'Enjoying a beautiful day at the beach! 🏖️ #summer #vacation',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206'
      ],
      likes: 124,
      comments: 23,
      timeAgo: '2h ago',
      liked: false
    },
    {
      id: '2',
      username: 'user2',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      content: 'Just finished my new project! Check it out and let me know what you think.',
      likes: 89,
      comments: 12,
      timeAgo: '4h ago',
      liked: true
    },
    {
      id: '3',
      username: 'user3',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      content: 'Morning coffee and coding ☕💻 #developerlife',
      images: ['https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5'],
      likes: 215,
      comments: 42,
      timeAgo: '6h ago',
      liked: false
    },
  ]);

  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const loadMorePosts = () => {
    if (loading) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newPosts: Post[] = [
        {
          id: (posts.length + 1).toString(),
          username: `user${posts.length + 1}`,
          avatar: `https://randomuser.me/api/portraits/${posts.length % 2 === 0 ? 'women' : 'men'}/${posts.length + 1}.jpg`,
          content: `This is a new post #${posts.length + 1}`,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          timeAgo: `${posts.length + 1}h ago`,
          liked: false
        },
        {
          id: (posts.length + 2).toString(),
          username: `user${posts.length + 2}`,
          avatar: `https://randomuser.me/api/portraits/${posts.length % 2 === 1 ? 'women' : 'men'}/${posts.length + 2}.jpg`,
          content: `Another interesting post #${posts.length + 2}`,
          images: ['https://images.unsplash.com/photo-1493612276216-ee3925520721'],
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          timeAgo: `${posts.length + 2}h ago`,
          liked: false
        }
      ];
      setPosts([...posts, ...newPosts]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (feedRef.current) {
      observer.observe(feedRef.current);
    }

    return () => {
      if (feedRef.current) {
        observer.unobserve(feedRef.current);
      }
    };
  }, [posts]);

  return (
    <div className="max-w-xl mx-auto pb-20">
      {/* Stories */}
      <div className="p-4 bg-white rounded-lg shadow mb-4 overflow-x-auto">
        <div className="flex space-x-4">
          {stories.map(story => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <div className={`p-1 rounded-full ${story.seen ? 'bg-gray-200' : 'bg-gradient-to-tr from-yellow-400 to-pink-500'}`}>
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs truncate w-16 text-center">{story.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="rounded-lg overflow-hidden">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>{post.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.username}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-4">
              <p className="mb-4">{post.content}</p>
              
              {post.images && post.images.length > 0 && (
                <Carousel className="rounded-lg overflow-hidden">
                  <CarouselContent>
                    {post.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <img 
                          src={image} 
                          alt={`Post by ${post.username}`}
                          className="w-full h-auto rounded-lg object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {post.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              )}
            </CardContent>
            
            <CardFooter className="p-4 flex justify-between border-t">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-1 ${post.liked ? 'text-red-500' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </Button>
              
              <Button variant="ghost" className="flex items-center space-x-1">
                <MessageSquare className="h-5 w-5" />
                <span>{post.comments}</span>
              </Button>
              
              <Button variant="ghost" className="flex items-center space-x-1">
                <Share2 className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Infinite scroll loader */}
      <div ref={feedRef} className="flex justify-center p-4">
        {loading && (
          <div className="animate-pulse text-gray-500">Loading more posts...</div>
        )}
      </div>
    </div>
  );
};

export default Index;