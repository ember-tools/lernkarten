import unittest

from import_un_numbers import Findings, entries, hazard_class, hazard_numbers

PAGE = """
<table class="prettytable">
<tr><th>UN</th><th>Nr.</th><th>Klasse</th><th>Name</th></tr>
<tr><td>0005 - 0007</td><td></td><td>1</td><td>Patronen</td></tr>
<tr><td>1170</td><td>30 + 33</td><td>3</td><td>Ethanol</td></tr>
<tr><td>1203</td><td>33</td><td>3.</td><td>Benzin</td></tr>
<tr><td>1234</td><td>?</td><td>6-1</td><td>Etwas</td></tr>
<tr><td>2389</td><td>33</td><td></td><td>Furan</td></tr>
<tr><td>2990</td><td>30 / 33</td><td>2.1</td><td>Anders geschrieben</td></tr>
</table>
"""


class ImportTest(unittest.TestCase):
    def test_reads_ranges_lists_and_uncertain_numbers(self):
        findings = Findings()
        found = {entry["un"]: entry for entry in entries(PAGE, findings)}
        self.assertEqual(["0005", "0006", "0007", "1170", "1203", "1234", "2389", "2990"], sorted(found))
        self.assertEqual([], found["0006"]["hazard"])
        self.assertEqual(["30", "33"], found["1170"]["hazard"])
        self.assertEqual("3", found["1203"]["class"])
        self.assertEqual({"un": "1234", "hazard": [], "class": "6.1", "name": "Etwas", "uncertain": True}, found["1234"])

    def test_records_missing_classes_corrections_and_unread_numbers(self):
        findings = Findings()
        found = {entry["un"]: entry for entry in entries(PAGE, findings)}
        self.assertEqual(["2389"], findings.missing_class)
        self.assertEqual({"2.1 -> 2": 1}, findings.class_corrections)
        self.assertEqual("2", found["2990"]["class"])
        self.assertEqual({"2990": ["30 / 33"]}, findings.unread_hazard)

    def test_hazard_fields(self):
        self.assertEqual((["X423"], False, []), hazard_numbers("X423"))
        self.assertEqual((["60", "66"], False, []), hazard_numbers("60+66"))
        self.assertEqual(([], True, []), hazard_numbers(" ? "))
        self.assertEqual(([], False, ["33¹"]), hazard_numbers("33¹"))

    def test_stops_at_a_class_the_adr_does_not_know(self):
        with self.assertRaises(ValueError):
            hazard_class("10", Findings())
        with self.assertRaises(ValueError):
            hazard_class("4", Findings())


if __name__ == "__main__":
    unittest.main()
