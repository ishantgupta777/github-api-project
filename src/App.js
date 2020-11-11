import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Typography,
  TextField,
  makeStyles,
  withStyles,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  textField: {
    width: 300,
    alignSelf: 'center',
  },
}));

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const App = () => {
  const classes = useStyles();

  const [orgName, setOrgName] = useState('');
  const [numOfCommits, setNumOfCommits] = useState(0);
  const [numOfRepos, setNumOfRepos] = useState(0);
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [repoData, setRepoData] = useState([]);
  const [commitsData, setCommitsData] = useState([]);
  const [numPages, setNumOfPages] = useState(0);

  const getOrgData = async () => {
    try {
      const org = await axios.get(`https://api.github.com/orgs/${orgName}`, {
        headers: {
          Accept: 'application/vnd.github.nebula-preview+json',
        },
      });

      const accessibleReposApiRes = await axios.get(
        `https://api.github.com/search/repositories?q=org:${orgName}`,
        {
          headers: {
            Accept: 'application/vnd.github.nebula-preview+json',
          },
        }
      );
      const accessibleRepoCount = accessibleReposApiRes.data.total_count;
      setOrgData({ ...org.data, accessibleRepos: accessibleRepoCount });
      if (org?.data?.public_repos)
        setNumOfPages(
          Math.min(
            Math.ceil(accessibleRepoCount / 30),
            Math.ceil(numOfRepos / 30)
          )
        );
      else setNumOfPages(0);
      console.log(org);
    } catch (err) {
      setOrgData(null);
      setNumOfCommits(0);
      setNumOfPages(0);
      setNumOfRepos(0);
      console.log(err);
      if (err?.response?.status === 422)
        setError("Org doesn't exist on github");
      else if (err?.response?.status === 403)
        setError('Github api limit exceeded');
      else setError(err.message);
    }
  };

  const getTotalCommits = async repoName => {
    try {
      console.log(repoName);
      const res = await axios.get(
        `https://api.github.com/repos/${repoName}/commits?per_page=100`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      const numOfPages =
        res?.headers?.link?.split(',')[1]?.match(/.*page=(?<page_num>\d+)/)
          ?.groups?.page_num || 1;

      const resLastPage = await axios.get(
        `https://api.github.com/repos/${repoName}/commits?per_page=100&page=${numOfPages}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      return resLastPage.data.length + 100 * (numOfPages - 1);
    } catch (err) {
      console.log(err);
    }
    return 0;
  };

  const getRepos = async () => {
    try {
      console.log(page, 'page');
      const orgRepos = await axios.get(
        `https://api.github.com/search/repositories?q=org:${orgName}&sort=forks&order=desc&per_page=30&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json',
          },
        }
      );
      console.log(orgRepos.data, 'repos');
      const numOfReposGreterThanN =
        30 * (page - 1) + orgRepos.data.items.length > numOfRepos;
      console.log(numOfReposGreterThanN);
      if (numOfReposGreterThanN)
        orgRepos.data.items = orgRepos.data.items.slice(0, numOfRepos % 30);

      orgRepos.data.items = await Promise.all(
        orgRepos.data.items.map(async obj => {
          const totalCommits = await getTotalCommits(obj.full_name);
          return { ...obj, totalCommits };
        })
      );

      setRepoData([
        ...orgRepos.data.items.map((obj, ind) => {
          return { ...obj, id: 30 * (page - 1) + ind + 1 };
        }),
      ]);
    } catch (err) {
      setOrgData(null);
      setNumOfCommits(0);
      setNumOfPages(0);
      setNumOfRepos(0);
      console.log(err?.response);
      if (err?.response?.status === 422)
        setError("Org doesn't exist on github");
      else if (err?.response?.status === 403)
        setError('Github api limit exceeded');
      else setError(err.message);
    }
  };

  const handleGetData = async () => {
    try {
      setError(null);
      if (!orgName) {
        setError('Please enter org name');
        return;
      }
      await getOrgData();
      await getRepos();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRepos();
  }, [page]);

  return (
    <div className='App'>
      <AppBar position='static'>
        <Typography variant='h6' color='inherit'>
          Ishant Github Assignment
        </Typography>
      </AppBar>
      <Container>
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
        {orgData && (
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
        )}

        {repoData.length > 0 && (
          <div style={{ marginTop: 40, color: 'red' }}>
            <Typography variant='h5'>
              Top n repos (according to forks count)
            </Typography>
            <div
              style={{
                marginTop: 20,
                color: 'black',
                width: '100%',
              }}
            >
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='customized table'>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell align='center'>Name</StyledTableCell>
                      <StyledTableCell align='center'>Forks</StyledTableCell>
                      <StyledTableCell align='center'>
                        Commit Count
                      </StyledTableCell>
                      <StyledTableCell align='center'>URL</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {repoData.map(row => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component='th' scope='row'>
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {row.full_name}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {row.forks}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {row.totalCommits}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <a
                            href={row.html_url}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {row.html_url}
                          </a>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 50,
              }}
            >
              {page < numPages && (
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  style={{ marginRight: 20 }}
                >
                  Next
                </Button>
              )}
              {page > 1 && (
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    setPage(page - 1);
                  }}
                  style={{ marginLeft: 20 }}
                >
                  Prev
                </Button>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default App;
