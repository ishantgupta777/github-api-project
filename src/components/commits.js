import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Typography,
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
import { Link } from 'react-router-dom';

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

const CommitsPage = props => {
  const classes = useStyles();

  const [commits, setCommits] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(1);

  useEffect(() => {
    console.log(props.location.data);
    const { repoName, numOfCommits } = props.location.data;
    setNumPages(
      Math.min(
        Math.ceil(props.location.data.totalCommits / 100),
        Math.ceil(numOfCommits / 100)
      )
    );
    const getCommits = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.github.com/repos/${repoName}/commits?per_page=100&page=${page}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
            },
          }
        );
        console.log(res.data);
        const numOfCommitssGreterThanM =
          100 * (page - 1) + res.data.length > numOfCommits;
        console.log(numOfCommitssGreterThanM);
        if (numOfCommitssGreterThanM)
          res.data = res.data.slice(0, numOfCommits % 100);
        setCommits(
          res.data.map((commit, ind) => {
            return { ...commit, id: 100 * (page - 1) + ind + 1 };
          })
        );
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getCommits();
  }, [page]);

  return (
    <div className='App'>
      <AppBar position='static'>
        <Typography variant='h6' color='inherit'>
          Ishant Github Assignment
        </Typography>
      </AppBar>
      <Typography color='error' style={{ marginTop: 10 }}>
        {loading ? 'Fetching Data' : null}
      </Typography>
      <Container>
        {commits.length > 0 && (
          <div style={{ marginTop: 40, color: 'red' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to='/'>
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ marginRight: 20 }}
                >
                  Back
                </Button>
              </Link>
              <Typography variant='h5'>
                Top m ({props?.location?.data?.numOfCommits}) commits of repo{' '}
                {props?.location?.data?.repoName || ''}
              </Typography>
            </div>
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
                      <StyledTableCell align='center'>Author</StyledTableCell>
                      <StyledTableCell align='center'>Message</StyledTableCell>
                      <StyledTableCell align='center'>URL</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commits.map(row => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component='th' scope='row'>
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align='center'
                          style={{ color: 'red' }}
                        >
                          {row?.commit?.author?.name || null}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {row?.commit?.message?.substring(0, 111)}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <a
                            href={row.html_url}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {row.html_url.substring(0, 50)}
                          </a>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Typography color='error' style={{ marginTop: 10 }}>
              {loading ? 'Fetching Data' : null}
            </Typography>
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

export default CommitsPage;
