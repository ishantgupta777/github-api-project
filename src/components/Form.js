import React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useStyles } from '../pages/Styles';

export default function Form({
  handleGetData,
  orgName,
  setOrgName,
  numOfRepos,
  setNumOfRepos,
  numOfCommits,
  setNumOfCommits,
  error,
}) {
  const classes = useStyles();
  return (
    <form
      className={classes.root}
      noValidate
      autoComplete='off'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
      }}
      onSubmit={e => {
        e.preventDefault();
        handleGetData();
      }}
    >
      <div>
        <TextField
          className={classes.textField}
          id='org_name'
          label='Enter org name'
          value={orgName}
          onChange={e => {
            setOrgName(e.target.value);
          }}
          required
        />
      </div>
      <div>
        <TextField
          className={classes.textField}
          id='n_value'
          label='Enter n (number of repos)'
          type='number'
          value={numOfRepos}
          onChange={e => {
            setNumOfRepos(parseInt(e.target.value, 10));
          }}
          InputProps={{ inputProps: { min: 0 } }}
          required
        />
      </div>
      <div>
        <TextField
          className={classes.textField}
          id='m_value'
          label='Enter m (number of commits)'
          type='number'
          value={numOfCommits}
          onChange={e => {
            setNumOfCommits(parseInt(e.target.value, 10));
          }}
          InputProps={{ inputProps: { min: 0 } }}
          required
        />
      </div>
      <div>
        <Button
          variant='contained'
          color='secondary'
          type='submit'
          onClick={handleGetData}
        >
          Get Data
        </Button>
        <Typography style={{ marginTop: 5 }} color='error'>
          {error || null}
        </Typography>
      </div>
    </form>
  );
}
