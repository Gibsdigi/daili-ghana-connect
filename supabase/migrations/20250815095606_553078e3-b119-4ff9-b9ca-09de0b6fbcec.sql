-- Fix missing RLS policies

-- Policies for user_verification table
CREATE POLICY "Users can view their own verification" ON public.user_verification
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND verification_status = 'verified')
  );

CREATE POLICY "Users can insert their own verification" ON public.user_verification
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policies for conversations table
CREATE POLICY "Users can view conversations they participate in" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = conversations.id 
      AND user_id = auth.uid()
      AND left_at IS NULL
    )
  );

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update conversations they created" ON public.conversations
  FOR UPDATE USING (auth.uid() = created_by);

-- Policies for conversation_participants table
CREATE POLICY "Users can view participants in their conversations" ON public.conversation_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp2
      WHERE cp2.conversation_id = conversation_participants.conversation_id
      AND cp2.user_id = auth.uid()
      AND cp2.left_at IS NULL
    )
  );

CREATE POLICY "Users can join conversations" ON public.conversation_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave conversations" ON public.conversation_participants
  FOR UPDATE USING (user_id = auth.uid());

-- Policies for marketplace_categories table
CREATE POLICY "Anyone can view categories" ON public.marketplace_categories
  FOR SELECT USING (is_active = true);

-- Policies for post_interactions table
CREATE POLICY "Users can view interactions on public posts" ON public.post_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.social_posts 
      WHERE id = post_interactions.post_id 
      AND (privacy = 'public' OR author_id = auth.uid())
    )
  );

CREATE POLICY "Users can create interactions" ON public.post_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own interactions" ON public.post_interactions
  FOR DELETE USING (user_id = auth.uid());

-- Policies for comments table
CREATE POLICY "Users can view comments on public posts" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.social_posts 
      WHERE id = comments.post_id 
      AND (privacy = 'public' OR author_id = auth.uid())
    )
  );

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (author_id = auth.uid());

-- Fix function security by setting search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;