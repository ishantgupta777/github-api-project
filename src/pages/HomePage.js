import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container } from '@material-ui/core';
import Navbar from '../components/NavBar';
import OrgData from '../components/OrgData';
import RepoTable from '../components/RepoTable';
import Form from '../components/Form';

const HomePage = props => {
  // react states
  const [orgName, setOrgName] = useState(props?.location?.data?.orgName || '');
  const [numOfCommittees, setNumOfCommittees] = useState(
    props?.location?.data?.numOfCommittees || 0
  ); // value of m
  const [numOfRepos, setNumOfRepos] = useState(
    props?.location?.data?.numOfRepos || 0
  ); // value of n
  const [orgData, setOrgData] = useState(null); // to store data of a organization
  const [error, setError] = useState(null); // state to store any possible error states
  const [page, setPage] = useState(1); // state to store page number of repos, each page consists of at max 10 repos
  const [repoData, setRepoData] = useState([]); // state to store repos fetched from github api
  const [numPages, setNumOfPages] = useState(1); // max number of pages that can be possible from N value or number of repos exists in the org
  const [loading, setLoading] = useState(false); // state to store if data is getting fetched from GitHub api or not

  // this function will set states back to their initial values in case of an error
  const setStatesBackToInitialValues = () => {
    setOrgName('');
    setOrgData(null);
    setLoading(false);
    setNumOfCommittees(0);
    setNumOfPages(1);
    setNumOfRepos(0);
    setPage(1);
    setLoading(false);
  };

  const getOrgData = async () => {
    try {
      setLoading(true);
      setPage(1);

      const org = await axios.get(`https://api.github.com/orgs/${orgName}`, {
        headers: {
          Accept: 'application/vnd.github.nebula-preview+json',
          Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
        },
      });

      const accessibleReposApiRes = await axios.get(
        `https://api.github.com/search/repositories?q=org:${orgName}`,
        {
          headers: {
            Accept: 'application/vnd.github.nebula-preview+json',
            Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098', // this token has no private permission, its used so that github api limit can be increased
          },
        }
      );

      const accessibleRepoCount = accessibleReposApiRes.data.total_count;
      setOrgData({ ...org.data, accessibleRepos: accessibleRepoCount });

      // this block of code will set max num of pages possible
      if (org?.data?.public_repos)
        setNumOfPages(
          Math.min(
            Math.ceil(accessibleRepoCount / 10),
            Math.ceil(numOfRepos / 10)
          )
        );
      else setNumOfPages(0);

      setLoading(false);
    } catch (err) {
      setStatesBackToInitialValues();

      console.log(err);
      if (err?.response?.status === 422)
        setError("Org doesn't exist on github");
      else if (err?.response?.status === 403)
        setError('Github api limit exceeded');
      else setError(err.message);
    }
  };

  const getCommitsCount = async repoName => {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${repoName}/commits?per_page=100`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
          },
        }
      );

      // this block of code will get the num of pages from the response of above api call
      const numOfPages =
        res?.headers?.link?.split(',')[1]?.match(/.*page=(?<page_num>\d+)/)
          ?.groups?.page_num || 1;

      const resLastPage = await axios.get(
        `https://api.github.com/repos/${repoName}/commits?per_page=100&page=${numOfPages}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
          },
        }
      );

      // return total commit counts of repo
      return resLastPage.data.length + 100 * (numOfPages - 1);
    } catch (err) {
      setStatesBackToInitialValues();
      console.log(err);
    }
    return 0;
  };

  // this function will get the top repos of the org on the basis of forks
  const getRepos = async () => {
    try {
      setLoading(true);

      const orgRepos = await axios.get(
        `https://api.github.com/search/repositories?q=org:${orgName}&sort=forks&order=desc&per_page=10&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github.mercy-preview+json',
            Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
          },
        }
      );

      // this block of code will check if the repos got from the api response are more than N value
      const numOfReposGreterThanN =
        10 * (page - 1) + orgRepos.data.items.length > numOfRepos;

      if (numOfReposGreterThanN)
        orgRepos.data.items = orgRepos.data.items.slice(0, numOfRepos % 10);

      // this code will get the commits count of each repo
      orgRepos.data.items = await Promise.all(
        orgRepos.data.items.map(async obj => {
          const totalCommits = await getCommitsCount(obj.full_name);
          return { ...obj, totalCommits };
        })
      );

      setRepoData([
        ...orgRepos.data.items.map((obj, ind) => {
          return { ...obj, id: 10 * (page - 1) + ind + 1 };
        }),
      ]);

      setLoading(false);
    } catch (err) {
      setStatesBackToInitialValues();

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
      setStatesBackToInitialValues();
      console.log(err);
    }
  };

  useEffect(() => {
    getRepos();
  }, [page]);

  return (
    <div className='App'>
      <Navbar />
      <Container>
        <Form
          handleGetData={handleGetData}
          orgName={orgName}
          setOrgName={setOrgName}
          numOfRepos={numOfRepos}
          setNumOfRepos={setNumOfRepos}
          numOfCommittees={numOfCommittees}
          setNumOfCommittees={setNumOfCommittees}
          error={error}
        />

        <Typography color='error' style={{ marginTop: 10 }}>
          {loading ? 'Fetching Data' : null}
        </Typography>

        {orgData && <OrgData orgData={orgData} />}

        {repoData.length > 0 && (
          <RepoTable
            repoData={repoData}
            page={page}
            setPage={setPage}
            numOfCommittees={numOfCommittees}
            numPages={numPages}
            loading={loading}
            orgName={orgName}
            numOfRepos={numOfRepos}
          />
        )}
      </Container>
    </div>
  );
};

export default HomePage;
