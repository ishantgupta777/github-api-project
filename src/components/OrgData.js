import React from 'react';
import { Typography } from '@material-ui/core';

export default function OrgData({ orgData }) {
  return (
    <div style={{ marginTop: 30, color: 'red', fontWeight: 700 }}>
      <Typography variant='h5'>Org Details</Typography>
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          color: 'black',
        }}
      >
        <Typography variant='subtitle1'>
          Name: {orgData?.name || null}
        </Typography>
        <Typography variant='subtitle1'>
          Public Repos: {orgData?.public_repos || null}
        </Typography>
        <Typography variant='subtitle1'>
          Accessible Repos: {orgData?.accessibleRepos || null}
        </Typography>
        <Typography variant='subtitle1'>
          Email: {orgData?.email || null}
        </Typography>
      </div>
    </div>
  );
}
