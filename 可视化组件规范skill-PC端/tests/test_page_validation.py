# -*- coding: utf-8 -*-
"""Behavioral checks: valid data passes static gates, tampering and wrong math fail."""
import copy,json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build_page import build
from validate_page import validate
ROOT=Path(__file__).resolve().parents[1]
class PageValidation(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.out=Path(self.temp.name)/'page.html';self.config=json.loads((ROOT/'assets/offline/trial-funding.json').read_text())
    def tearDown(self):self.temp.cleanup()
    def test_valid_build_has_automatic_report_and_no_claim_of_visual_parity(self):
        build(self.config,self.out,browser='off');r=json.loads(self.out.with_suffix('.validation.json').read_text())
        self.assertEqual(r['status'],'partial');self.assertEqual(r['summary']['fail'],0);self.assertFalse(r['fullVisualParity']);self.assertTrue(r['componentReferences'])
    def test_wrong_funding_math_blocks_delivery(self):
        self.config['screens'][0]['components'][0]['props']['cumulative']['excluded']=1
        with self.assertRaises(ValueError):build(self.config,self.out,browser='off')
        r=json.loads(self.out.with_suffix('.validation.json').read_text());self.assertTrue(any(c['status']=='fail' and c['rule'].endswith('excluded') for c in r['checks']))
    def test_wrong_display_percentage_blocks_delivery(self):
        self.config['screens'][0]['components'][0]['props']['cumulative']['actual_share_display']='100%'
        with self.assertRaises(ValueError):build(self.config,self.out,browser='off')
    def test_unregistered_component_blocks_delivery(self):
        self.config['screens'][0]['components'].append({'type':'madeUpChart'})
        with self.assertRaises(ValueError):build(self.config,self.out,browser='off')
    def test_css_replacement_detected(self):
        build(self.config,self.out,browser='off');self.out.write_text(self.out.read_text().replace('36px/44px','46px/44px'))
        r=validate(self.out,browser='off');self.assertEqual(r['status'],'fail');self.assertTrue(any(c['rule']=='output-integrity' and c['status']=='fail' for c in r['checks']))
    def test_uninstrumented_html_cannot_pass(self):
        self.out.write_text('<html><body>Screenshot only</body></html>');self.assertEqual(validate(self.out,browser='off')['status'],'fail')
if __name__=='__main__':unittest.main()
