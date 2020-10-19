import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visitable, create, clickable, text } from 'ember-cli-page-object';
import login from '../helpers/login';
import { setUa } from '../helpers/set-ua';

const userAgent = window.navigator.userAgent;

module('Acceptance | onboarding index', function (hooks) {
  const onboardingUrl = '/onboarding';

  const page = create({
    visit: visitable(onboardingUrl),
    nextStep: clickable('[data-test-next-step]'),
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);
  login();

  hooks.afterEach(function () {
    // Reset to the original user agent when this test was initialized
    setUa(userAgent.valueOf());
  });

  test('visiting as windows', async function (assert) {
    setUa(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
    );
    await page.visit();

    assert.equal(currentURL(), `${onboardingUrl}/install/chocolatey`);
  });

  test('advances to connect', async function (assert) {
    await page.visit().nextStep();

    assert.equal(currentURL(), `${onboardingUrl}/connect`);
  });
});

module('Acceptance | onboarding connect', function (hooks) {
  const connectUrl = '/onboarding/connect';

  const page = create({
    visit: visitable(connectUrl),
    nextStep: clickable('[data-test-next-step]'),
    token: text('[data-test-token]'),
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);
  login();

  test('advances to start', async function (assert) {
    await page.visit().nextStep();

    assert.equal(currentURL(), `/onboarding/start`);
  });

  test('renders a real token', async function (assert) {
    await page.visit();

    assert.equal(page.token.length, 101);
  });
});

module('Acceptance | onboarding start', function (hooks) {
  const startUrl = '/onboarding/start';

  const page = create({
    visit: visitable(startUrl),
    nextStep: clickable('[data-test-next-step]'),
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);
  login();

  test('sends users to default workspace after completion', async function (assert) {
    await page.visit().nextStep();

    assert.equal(currentURL(), `/default`);
  });
});
