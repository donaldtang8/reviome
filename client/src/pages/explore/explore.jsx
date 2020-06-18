import React, { lazy, Suspense } from 'react';
import { Switch, Route, withRouter, useRouteMatch } from 'react-router';

import Spinner from './../../components/spinner/spinner';

const ExploreOverview = lazy(() => import('./explore-overview'));
const ExploreFeed = lazy(() => import('./../../pages/explore/explore-feed'));
const Category = lazy(() => import('./../../components/category/category'));

const Explore = ({ history }) => {
  let { path } = useRouteMatch();

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route
          exact
          path={`${path}/:category/:genre`}
          component={ExploreFeed}
          history={history}
        />
        <Route
          exact
          path={`${path}/:category`}
          component={Category}
          history={history}
        />
        <Route path={path} component={ExploreOverview} history={history} />
      </Switch>
    </Suspense>
  );
};

export default withRouter(Explore);
