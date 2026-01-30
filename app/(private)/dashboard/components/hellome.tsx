import useMe from '@/hooks/useMe';
import React from 'react';

export default function HelloMe() {
  const { user, loading } = useMe();

  if (loading) return <h1>trying to remember your name...</h1>;
  return <h1>Hello {user?.username.split('@')[0]}</h1>;
}
