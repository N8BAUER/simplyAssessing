import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import aa from 'search-insights';
import {
  searchBox,
  hits,
  pagination,
  refinementList,
} from 'instantsearch.js/es/widgets';
import resultHit from '../templates/result-hit';

/**
 * @class ResultsPage
 * @description Instant Search class to display content on main page.
 */
class ResultPage {
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @returns {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY
    );

    this._searchInstance = instantsearch({
      indexName: process.env.ALGOLIA_INDEX,
      searchClient: this._searchClient,
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @returns {void}
   */
  _registerWidgets() {
    this._searchInstance.addWidgets([
      searchBox({
        container: '#searchbox',
      }),
      hits({
        container: '#hits',
        templates: {
          item: resultHit,
        },
      }),
      pagination({
        container: '#pagination',
      }),
      refinementList({
        container: '#brand-facet',
        attribute: 'brand',
        searchable: true
      }),
      refinementList({
        container: '#categories-facet',
        attribute: 'categories',
        searchable: true
      }),
      refinementList({
        container: '#free_shipping-facet',
        attribute: 'free_shipping',
      }),
    ]);
  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @returns {void}
   */
  _startSearch() {
    const insightsMiddleware = createInsightsMiddleware({
      insightsClient: aa,
    });

    aa('setUserToken', 'testUser');
    this._searchInstance.use(insightsMiddleware);
    this._searchInstance.start();
  }
}

export default ResultPage;
